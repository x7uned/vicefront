'use client';

import { Kanit } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '@/redux/store';
import { fetchConfirm } from '@/redux/user.slice';
import { useRouter, useSearchParams } from 'next/navigation';

const kanit = Kanit({ subsets: ["latin"], weight: ['500'] });

const schema = yup.object().shape({
  confirmCode: yup.string().required('Code is required'),
});

interface confirmFormInterface {
  confirmCode: string,
}

const VerificationForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
});

  const onSubmit = async (data: confirmFormInterface) => {
    try {
    const params = {
      email: email || '',
      confirmationCode: data.confirmCode || '',
    }
    const fetch = await dispatch(fetchConfirm(params))

    if (fetch?.payload.access_token && fetch?.payload.success) {
      router.push('/')
    }
    } catch (error) {
        console.error('Sign up failed:', error);
    }
};

  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <div className="flex flex-col gap-3">
        <p className={`text-2xl ${kanit.className}`}>Verify your account</p>
        <form className='formR' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input id="confirmCode" {...register('confirmCode')} className="w-full p-2 border rounded" />
            {errors.confirmCode && <span>{errors.confirmCode.message}</span>}
          </div>
          <button type="submit" className="sumbitButton w-full py-2 rounded">Continue</button>
        </form>
      </div>
    </div>
  );
}

function Verification() {
  return (
      <div className="flex h-screen w-screen">
          <div className="flex flex-col w-1/2">
              <VerificationForm />
          </div>
          <div className="flex justify-center bg-center bg-cover bg-[url(/signinBG.jpg)] w-1/2"></div>
      </div>
  );
}

export default Verification;
