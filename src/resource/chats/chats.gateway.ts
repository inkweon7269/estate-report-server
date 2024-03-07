import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CreateChatDto } from '@root/resource/chats/dtos/create-chat.dto';
import { ChatsService } from '@root/resource/chats/chats.service';
import { EnterChatDto } from '@root/resource/chats/dtos/enter-chat.dto';
import { MessagesService } from '@root/resource/messages/messages.service';
import { CreateMessagesDto } from '@root/resource/messages/dtos/create-messages.dto';
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from '@root/common/exception-filter/socket-catch-http.exception-filter';
import { SocketGuard } from '@root/auth/guards/socket/socket.guard';
import { UserEntity } from '@root/entities/user.entity';

@WebSocketGateway({
    // ws://localhost:8000/chats
    namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly messagesService: MessagesService,
    ) {}

    @WebSocketServer()
    server: Server;

    handleConnection(socket: Socket) {
        console.log(`on connect called : ${socket.id}`);
    }

    @UsePipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    )
    @SubscribeMessage('enter_chat')
    async enterChat(
        // 방의 chat ID들을 리스트로 받는다.
        @MessageBody() data: EnterChatDto,
        @ConnectedSocket() socket: Socket,
    ) {
        /*for (const chatId of data) {
            // socket.join()
            // 무조건 스트링으로 받는다.
            socket.join(chatId.toString());
        }*/

        for (const chatId of data.chatIds) {
            const exists = await this.chatsService.checkIfChatExists(chatId);

            if (!exists) {
                throw new WsException({
                    code: 100,
                    message: `존재하지 않는 chat입니다. chatId: ${chatId}`,
                });
            }
        }

        socket.join(data.chatIds.map((x) => x.toString()));
    }

    // Socket.io 에서는 글로벌 Validation이 적용되지 않아 다음과 같이 직접 삽입해야 한다.
    @UsePipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    )
    @UseFilters(SocketCatchHttpExceptionFilter)
    @UseGuards(SocketGuard)
    @SubscribeMessage('create_chat')
    async createChat(@MessageBody() data: CreateChatDto, @ConnectedSocket() socket: Socket & { user: UserEntity }) {
        const chat = await this.chatsService.createChat(data);
    }

    // socket.on('send_message', (message) => { console.log(message) });
    @UsePipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    )
    @SubscribeMessage('send_message')
    async sendMessage(@MessageBody() dto: CreateMessagesDto, @ConnectedSocket() socket: Socket) {
        // console.log(message);
        // this.server.emit('receive_message', 'hello from server');

        // 내가 속해 있는 모든 방에 전달
        // this.server.in(message.chatId.toString()).emit('receive_message', message.message);

        // Broadcasting : 나를 제외하고 다른 사람에게만 메시지를 보내는 행위
        // socket.to(message.chatId.toString()).emit('receive_message', message.message);

        const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);

        if (!chatExists) {
            throw new WsException(`존재하지 않는 채팅방입니다. Chat ID : ${dto.chatId}`);
        }

        const message = await this.messagesService.createMessage(dto);
        socket.to(message.chat.id.toString()).emit('receive_message', message.message);
    }
}
