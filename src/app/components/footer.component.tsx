import { Outfit } from "next/font/google";
import Link from "next/link";

const outfit = Outfit({ subsets: ["latin"], weight: ["300"] });

const FooterComponent = () => {
    return (
        <div className={`footer px-96 py-5 flex flex-col h-48 ${outfit.className}`}>
            <div className="flex w-full justify-around h-full">
                <Link href="/"><p className="text-[20px] cursor-pointer">Vice</p></Link>
                <div className="flex flex-col mt-[2px]">
                    <p className="font-bold text-lg">Social</p>
                    <Link href="https://github.com/x7uned/vicefront" target="_blank"><p className="textChangeColor">GitHub</p></Link>
                    <Link href="https://www.instagram.com/x7uned" target="_blank"><p className="textChangeColor">Instagram</p></Link>
                    <Link href="https://t.me/x7uned" target="_blank"><p className="textChangeColor">Telegram</p></Link>
                    <Link href="https://robota.ua/candidates/23413034" target="_blank"><p className="textChangeColor">Summary</p></Link>
                </div>
                <div className="flex flex-col mt-[2px]">
                    <p className="font-bold text-lg">Help (WIP)</p>
                    <p className="textChangeColor cursor-pointer">About</p>
                    <p className="textChangeColor cursor-pointer">Contact</p>
                    <p className="textChangeColor cursor-pointer">Terms</p>
                    <p className="textChangeColor cursor-pointer">Privacy</p>
                </div>
                <p>Powered by <Link href="https://github.com/x7uned" target="_blank"><span className="font-bold">x7uned</span></Link></p>
            </div>
        </div>
    )
}

export default FooterComponent