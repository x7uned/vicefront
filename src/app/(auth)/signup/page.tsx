'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Kanit } from "next/font/google";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useAppDispatch } from '@/redux/store';
import { fetchSignUp } from '@/redux/user.slice';
import { useRouter } from 'next/navigation';

const kanit = Kanit({ subsets: ["latin"], weight: ['500'] });

const schema = yup.object().shape({
    username: yup.string().min(3, 'Min 3 symbols').required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Min 6 symbols').required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required')
});

export interface SignUpInterface {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUpForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter()

    const onSubmit = async (data: SignUpInterface) => {
        try {
            const params = {
            email: data.email,
            username: data.username,
            password: data.password
            }
            const fetch = await dispatch(fetchSignUp(params))

            if (fetch?.payload.success && fetch?.payload.email) {
                router.push(`/verification?email=${fetch?.payload.email}`)
            }
        } catch (error) {
            console.error('Sign up failed:', error);
        }
    };

    return (
        <div className="flex h-full justify-center items-center">
            <div className="flex gap-8 flex-col p-6 items-center min-h-1/3 rounded-2xl w-1/2 border-[#252525] border-[1px]">
                <div className="flex flex-col gap-1 w-full">
                    <p className={`text-2xl ${kanit.className}`}>Sign Up</p>
                    <p className="text-gray-400">Choose your preferred sign up method</p>
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
                <form onSubmit={handleSubmit(onSubmit)} className="w-full formR">
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input id="username" {...register('username')} className="w-full p-2 border rounded" />
                        {errors.username && <span>{errors.username.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input id="email" {...register('email')} className="w-full p-2 border rounded" />
                        {errors.email && <span>{errors.email.message}</span>}
                    </div>
                    <div className="relative">
                        <label htmlFor="password">Password:</label>
                        <input id="password" type={showPassword ? "password" : "text"} {...register('password')} className="w-full p-2 border rounded" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-9">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && <span>{errors.password.message}</span>}
                    </div>
                    <div className="relative">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input id="confirmPassword" type={showConfirmPassword ? "password" : "text"} {...register('confirmPassword')} className="w-full p-2 border rounded" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-9">
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
                    </div>
                    <button type="submit" className="sumbitButton w-full mt-4 py-2 rounded">Continue</button>
                </form>
                <div className="flex w-full justify-start">
                    <div className="flex">
                        <p className='text-gray-400'>Already have an account?</p>
                        <Link href="/signin">
                            <p className='ml-1'>Sign in</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignUp() {
    return (
        <div className="flex h-screen w-screen">
            <div className="flex flex-col w-1/2">
                <SignUpForm />
            </div>
            <div className="flex justify-center bg-center bg-cover bg-[url(/signinBG.jpg)] w-1/2"></div>
        </div>
    );
}
