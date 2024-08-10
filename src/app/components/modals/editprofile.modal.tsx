import { Profile } from '@/app/user/[id]/page';
import React from 'react';

interface ModalProps {
  onClose: () => void;
  profile: Profile;
}

const ProfileModalComponent: React.FC<ModalProps> = ({ onClose, profile }) => {
  return (
    <div onClick={onClose} className="bganim z-20 bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
      <div onClick={(e) => e.stopPropagation()} className="dark:bg-custom-gradient h-96 bg-white gap-2 text-center border-[#ffffff22] border w-[500px] flex overflow-hidden flex-col items-center justify-start rounded-xl shadow-lg">
        <form className='flex w-full flex-col'>
            <div className="flex h-54 w-full justify-center">
                <div 
                style={{ backgroundImage: `url(${profile.banner ? profile.banner : 'https://i.pinimg.com/564x/f6/41/90/f641905331279ff587d837a6e1d366c5.jpg'})` }} 
                className="flex w-full p-3 justify-end bg-no-repeat bg-cover bg-center h-[120px]"
                ></div>
                <div className="flex justify-center items-center absolute rounded-full bg-[var(--background-color)] mt-12 w-[120px] h-[120px]">
                    <div 
                    style={{ backgroundImage: `url(${profile.avatar 
                            ? 
                            profile.avatar 
                            : 
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/1024px-Missing_avatar.svg.png'})` }} 
                            className="bg-center rounded-full w-[100px] h-[100px] bg-no-repeat bg-contain">
                    </div>
                </div>
            </div>
            <p className='mt-12 text-3xl'>{profile.username}</p>
        </form>
      </div>
    </div>
  );
};

export default ProfileModalComponent;
