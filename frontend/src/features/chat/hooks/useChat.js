import { intializeSocketConnection } from "../services/chat.socket.js";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api.js";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice.js";
import { useDispatch } from "react-redux";

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({message, chatId}){
        
        dispatch(setLoading(false))

        if(chatId){
            dispatch(addNewMessage({
                chatId,
                content: message,
                role: "user"
            }))  
        }

        const data = await sendMessage({message, chatId})
        const {chat, aiMessage} = data
        if(!chatId){
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title
            }))
            dispatch(addNewMessage({
            chatId: chat._id,
            content: message,
            role: "user"
            }))
            // await handleGetchats()
        }
        
        dispatch(addNewMessage({
            chatId: chat._id,
            content: aiMessage.content,
            role: aiMessage.role
        }))
        dispatch(setCurrentChatId(chat._id))
        dispatch(setLoading(false))
        return chat._id
    }

    async function handleGetchats(){
        dispatch(setLoading(true))
        const data = await getChats()
        const chats = data.chats.reverse()
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updateAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats){

        if(chats[chatId]?.messages.length === 0){

            dispatch(setLoading(true))
            const data = await getMessages(chatId)
            const {messages} = data
    
            const formattedMessages = messages.map((msg) => {
                return {
                    content: msg.content,
                    role: msg.role
                }
            })
    
            dispatch(addMessages({
                chatId,
                messages: formattedMessages
            }))
        }

        dispatch(setCurrentChatId(chatId))
    }

    async function handleDeleteChat(chatId){
        dispatch(setLoading(true))
        await deleteChat(chatId)
        await handleGetchats()
        dispatch(setLoading(false))
    }

    function handleStartNewChat() {
        dispatch(setLoading(true))
        dispatch(setCurrentChatId(null))
        dispatch(setLoading(false))
    }

    return {
        intializeSocketConnection, handleSendMessage, handleGetchats, handleOpenChat, handleDeleteChat, handleStartNewChat
    }
}