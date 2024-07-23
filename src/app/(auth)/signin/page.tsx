'use client'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Kanit } from "next/font/google";
import { FaGoogle, FaGithub, FaEyeSlash, FaEye  } from "react-icons/fa";
import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const kanit = Kanit({ subsets: ["latin"], weight: ['500'] });

const schema = yup.object().shape({
    email: yup.string().email('Email invalid').min(3, 'Min 3 symbols').required('Email is required'),
    password: yup.string().min(6, 'Min 6 symbols').required('Password is required')
});

export interface SignInInterface {
    email: string;
    password: string;
}

const SignInForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('')
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: SignInInterface) => {
        try {
            const {email, password} = data;

            const result = await signIn("credentials", {
                redirect: false,
                email,
                password
            });

            if (result?.error) {
                if(result?.error == "Configuration") {
                    setError("Login or password is invalid")
                } else {
                    setError("Something went wrong")
                }
            }

            if (!result?.error) {
                router.push('/')
            }
        } catch (error) {
            console.error('Sign up failed:', error);
        }
    };

    return (
        <div className="flex h-full justify-center items-center">
            <div className="flex gap-8 flex-col p-6 items-center min-h-1/3 rounded-2xl w-1/2 border-[#252525] border-[1px]">
                <div className="flex flex-col gap-1 w-full">
                    <p className={`text-2xl ${kanit.className}`}>Sign In</p>
                    <p className="text-gray-400">Choose your preferred sign in method</p>
                </div>
                <div className="flex gap-1 w-full">
                    <button onClick={() => signIn('google')} className="flex py-1 justify-center items-center gap-2 w-1/2 border-[#252525] border-[1px] rounded-[6px] ">
                        <p className="text-lg">Google</p>
                        <FaGoogle size="20px" />
                    </button>
                    <button className="flex py-1 justify-center items-center gap-2 w-1/2 border-[#252525] border-[1px] rounded-[6px] ">
                        <p className="text-lg">GitHub</p>
                        <FaGithub size="20px" />
                    </button>
                </div>
                <hr className="border-[#252525] h-[1px] w-full" />
                <form className='formR' onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input id="email" {...register('email')} />
                        {errors.email && <span>{errors.email.message}</span>}
                    </div>
                    <div className="relative">
                        <label htmlFor="password">Password:</label>
                        <input id="password" type={showPassword ? "password" : "text"} {...register('password')} className="w-full p-2 border rounded" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-9">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && <span>{errors.password.message}</span>}
                        {<span>{error}</span>}
                    </div>
                    <button className='sumbitButton' type="submit">Sign in</button>
                </form>
                <div className="flex w-full justify-between">
                    <div className="flex">
                        <p className='text-gray-400'>Dont have an account?</p>
                        <Link href="/signup">
                            <p className='ml-2'>Sign up</p>
                        </Link>
                    </div>
                    <p>Reset password</p>
                </div>
            </div>
        </div>
    )
}

export default function SignIn() {

    return (
        <div className="flex h-screen w-screen">
            <div className="flex flex-col w-1/2">
                <SignInForm />
            </div>
            <div className="flex justify-center bg-center bg-cover bg-[url(/signinBG.jpg)] w-1/2"></div>
        </div>
    )
}