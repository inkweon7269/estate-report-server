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

@WebSocketGateway({
    // ws://localhost:8000/chats
    namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
    constructor(private readonly chatsService: ChatsService) {}

    @WebSocketServer()
    server: Server;

    handleConnection(socket: Socket) {
        console.log(`on connect called : ${socket.id}`);
    }

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

    @SubscribeMessage('create_chat')
    async createChat(@MessageBody() data: CreateChatDto, @ConnectedSocket() socket: Socket) {
        const chat = await this.chatsService.createChat(data);
    }

    // socket.on('send_message', (message) => { console.log(message) });
    @SubscribeMessage('send_message')
    sendMessage(@MessageBody() message: { message: string; chatId: number }, @ConnectedSocket() socket: Socket) {
        // console.log(message);
        // this.server.emit('receive_message', 'hello from server');

        // 내가 속해 있는 모든 방에 전달
        // this.server.in(message.chatId.toString()).emit('receive_message', message.message);

        // Broadcasting : 나를 제외하고 다른 사람에게만 메시지를 보내는 행위
        socket.to(message.chatId.toString()).emit('receive_message', message.message);
    }
}
