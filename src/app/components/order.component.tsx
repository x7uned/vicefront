import { OrderFetchData } from "@/redux/orders.slice"

const OrderComponent = ({order}: {order: OrderFetchData}) => {

    return (
        <div className="flex justify-center text-center p-2 nft border rounded-lg border-[#252525] flex-col">
            <div className="flex flex-col justify-center items-center text-sm text-center">
                <p>{order.address}</p>
                <div className="flex flex-col xl:flex-row w-2/3 justify-around">
                    <p>{order.firstname}</p>
                    <p>{order.secondname}</p>
                    <p>{order.surname}</p>
                </div>
                <div className="flex flex-col xl:flex-row w-full justify-around">
                    <p className="w-full truncate ">{order.email}</p>
                    <p className="w-full truncate ">{order.number}</p>
                </div>
                <div className="flex flex-col xl:flex-row w-full justify-around">
                    <p>Products: {JSON.parse(order.cart).length}</p>
                    <p>Comment: {order.comment}</p>
                </div>
                <div className="hl mt-2"></div>
                <p className="mt-2 text-lg">Track delivery status</p>
            </div>
        </div>
    )
}

export default OrderComponent;