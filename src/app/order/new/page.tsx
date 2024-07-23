"use client"

import { Bs1SquareFill, Bs2SquareFill, Bs3SquareFill, BsArrowUpLeftSquareFill } from "react-icons/bs";
import { SiPrivatedivision } from "react-icons/si";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCart } from "../../components/contexts/cart.context";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { useAppDispatch } from "@/redux/store";
import { fetchCreateOrder } from "@/redux/orders.slice";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = yup.object().shape({
  firstname: yup.string()
    .required('First name is required')
    .max(50, 'First name must be at most 50 characters'),
  secondname: yup.string()
    .required('Second name is required')
    .max(50, 'Second name must be at most 50 characters'),
  surname: yup.string()
    .required('Last name is required')
    .max(50, 'Last name must be at most 50 characters'),
  number: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Phone number must be digits only')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits'),
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  postname: yup.string()
    .required('Post name is required')
    .max(100, 'Post name must be at most 100 characters')
    .oneOf(['meest', 'uapost', 'novapost', 'self'], 'Invalid post name'),
  address: yup.string()
    .required('Address is required')
    .max(200, 'Address must be at most 200 characters'),
  paymentmethod: yup.string()
    .required('Payment method is required')
    .oneOf(['creditcard', 'paypal', 'onreceipt', 'monopay', 'applepay'], 'Invalid payment method'),
  comment: yup.string()
    .max(500, 'Comment must be at most 500 characters'),
});

export interface OrderFormData {
  firstname: string;
  secondname?: string | undefined;
  surname: string;
  number: string;
  email: string;
  postname: 'meest' | 'uapost' | 'novapost' | 'self';
  address: string;
  paymentmethod: 'creditcard' | 'paypal' | 'onreceipt' | 'monopay' | 'applepay';
  comment?: string | undefined;
}

const OrderPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<OrderFormData>({
    resolver: yupResolver(schema),
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { cart, totalAmount } = useCart();
  const postname = watch('postname', 'meest');
  const [errorMessage, setErrorMessage] = useState<string>("")

  const onSubmit = async (data: OrderFormData) => {
    try {
      const cartClear = cart.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));
      const fetchData = await dispatch(fetchCreateOrder({...data, cart: cartClear}))

      if (fetchData.payload.success && fetchData.payload.orderId) {
        router.push(`/order/${fetchData.payload.orderId}`)
      } else if (!fetchData.payload.success && fetchData.payload.message) {
        setErrorMessage(fetchData.payload.message)
      }
    } catch (error) {
      console.error('Fetch Create Order failed:', error);
    }  
  };

  const getDeliveryCost = (postname: OrderFormData['postname']) => {
    switch (postname) {
      case 'uapost':
        return 3;
      case 'novapost':
        return 1;
      case 'meest':
        return 2;
      case 'self':
        return 0;
      default:
        return 0;
    }
  };

  const deliveryCost = getDeliveryCost(postname);

  return (
    <div className="flex justify-center items-start pt-16 px-36">
      <div className="flex items-center py-8 px-12 w-3/5">
        <form className="flex w-full !flex-row formR" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex !flex-row gap-6 w-full">
            <div className="flex flex-col w-full">
              <div className="flex !flex-row gap-4">
                <Bs1SquareFill size={"34px"} />
                <p className="text-3xl font-bold">Contact info</p>
              </div>
              <div className="flex mt-4">
                <div className="flex flex-col gap-3">
                  <div className="flex !flex-row items-center w-full gap-1">
                    <SiPrivatedivision />
                    <p className="text-xl">Personal Info</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <label htmlFor="firstname">First Name:</label>
                      <input placeholder="John" id="firstname" {...register('firstname')} />
                      {errors.firstname && <span>{errors.firstname.message}</span>}
                    </div>
                    <div>
                      <label htmlFor="secondname">Second Name:</label>
                      <input placeholder="Smith" id="secondname" {...register('secondname')} />
                      {errors.secondname && <span>{errors.secondname.message}</span>}
                    </div>
                    <div>
                      <label htmlFor="surname">Surname:</label>
                      <input placeholder="Winston" id="surname" {...register('surname')} />
                      {errors.surname && <span>{errors.surname.message}</span>}
                    </div>
                  </div>
                  <div className="flex !flex-row items-center w-full gap-1">
                    <SiPrivatedivision />
                    <p className="text-xl">Contacts</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <label htmlFor="number">Number:</label>
                      <input placeholder="04412332100" id="number" {...register('number')} />
                      {errors.number && <span>{errors.number.message}</span>}
                    </div>
                    <div>
                      <label htmlFor="email">Email:</label>
                      <input placeholder="email@email.com" id="email" {...register('email')} />
                      {errors.email && <span>{errors.email.message}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex !flex-row gap-4">
                <Bs2SquareFill size={"34px"} />
                <p className="text-3xl font-bold">Delivery</p>
              </div>
              <div className="flex mt-4">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <div>
                      <label htmlFor="postname">Post name:</label>
                      <select id="postname" {...register('postname')}>
                        <option value="meest">Meest</option>
                        <option value="uapost">UA Post</option>
                        <option value="novapost">Nova Post</option>
                        <option value="self">Self-delivery</option>
                      </select>
                      {errors.postname && <span>{errors.postname.message}</span>}
                    </div>
                    <div>
                      <label htmlFor="address">Address:</label>
                      <input placeholder="1450 Pennsylvania Avenue NW, Washington, USA" id="address" {...register('address')} />
                      {errors.address && <span>{errors.address.message}</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex !flex-row gap-4 mt-8">
                <Bs3SquareFill size={"34px"} />
                <p className="text-3xl font-bold">Payment</p>
              </div>
              <div className="flex mt-4">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <div>
                      <label htmlFor="paymentmethod">Payment method:</label>
                      <select id="paymentmethod" {...register('paymentmethod')}>
                        <option value="creditcard">Credit Card</option>
                        <option value="onreceipt">On receipt</option>
                        <option value="paypal">Paypal</option>
                        <option value="monopay">Mono Pay</option>
                        <option value="applepay">Apple Pay</option>
                      </select>
                      {errors.paymentmethod && <span>{errors.paymentmethod.message}</span>}
                    </div>
                    <div>
                      <label htmlFor="comment">Comment:</label>
                      <input id="comment" {...register('comment')} />
                      {errors.comment && <span>{errors.comment.message}</span>}
                    </div>
                  </div>
                </div>
              </div>
              <button className='sumbitButton mt-4' type="submit">Confirm order</button>
              {errorMessage && <span className="mt-2 w-full text-center">{errorMessage}</span>}
            </div>
          </div>
        </form>
      </div>
      <div className="flex flex-col h-1/2 w-2/5">
        <div className="flex items-center gap-4 !flex-row mt-8">
          <BsArrowUpLeftSquareFill size={"34px"} />
          <p className="text-3xl font-bold">Order</p>
        </div>
        {cart.length === 0 ? (
          <div className="flex w-full h-full flex-col">
            <div className="flex flex-col w-full h-screen justify-center items-center">
              <MdOutlineRemoveShoppingCart size={"100px"} />
              <p className='mt-3 text-[30px]'>Cart is empty</p>
            </div>
          </div>
        ) : (
          <div className="flex mt-6 gap-3 flex-col">
            {cart.map((item) => (
              <div className="flex items-center text-center gap-3" key={item.id}>
                <div
                  className="w-1/5 h-[80px] bg-center bg-contain bg-no-repeat"
                  style={{ backgroundImage: `url(${item.image})` }}
                  aria-label={item.name}
                ></div>
                <p className='w-3/5 text-[16px]'>{item.name}</p>
                <p className='w-1/5 text-[20px] text-end'>{(item.quantity > 1) ? `${item.quantity} x ` : ''}{item.price}$</p>
              </div>
            ))}
            <div className="hl"></div>
            <div className="flex flex-col pb-12 gap-2 px-36 text-xl">
              <div className="flex justify-between">
                <p>Items:</p>
                <p>{cart.length}</p>
              </div>
              <div className="flex justify-between">
                <p>Delivery cost:</p>
                <p>{deliveryCost}$</p>
              </div>
              <div className="flex justify-between">
                <p>Order cost:</p>
                <p>{totalAmount}$</p>
              </div>
              <div className="hl"></div>
              <div className="flex justify-between">
                <p onClick={() => console.log(cart)} className="text-3xl">Total:</p>
                <p className="text-3xl">{totalAmount+deliveryCost}$</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderPage;
