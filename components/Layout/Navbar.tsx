import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { navItems } from '@/data';
import { logo } from '@/assets';

const Navbar = () => {
	const router = useRouter();
	const [selectedPage, setSelectedPage] = useState('home');

	return (
		<nav className='w-full border-b-2 border-[#3F3F46]'>
			<div className='max-w-screen-xl mx-auto flex flex-row justify-between text-white py-4 px-8'>
				<div className='flex gap-4 items-center'>
					<Link href='/'>
						<Image src={logo} alt='socialorbit' width={38} placeholder='blur' />
					</Link>
					<div className='relative'>
						<span className='absolute inset-y-0 start-0 grid place-content-center px-4'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5 text-gray-400'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
									clipRule='evenodd'
								></path>
							</svg>
						</span>
						<input
							type='text'
							className='w-full rounded-xl bg-[#18181B] p-2 pe-6 ps-12 text-sm shadow-sm border-[1px] border-[#3F3F46] focus:outline-none font-circularRegular'
							placeholder='Search...'
						/>
					</div>
					{navItems.map((item, index) => (
						<div
							key={index}
							className={`font-circularMedium cursor-pointer text-sm py-[6px] px-[12px] rounded-lg tracking-wider ${
								selectedPage === item.id
									? 'bg-[#27272A]'
									: 'bg-black text-[#D4D4D8]'
							}`}
							onClick={() => {
								setSelectedPage(item.id);
								router.push(item.url);
							}}
						>
							{item.name}
						</div>
					))}
				</div>
				<div>
					<ConnectButton
						label='𖥸 Login'
						chainStatus='none'
						showBalance={false}
						accountStatus={{
							smallScreen: 'avatar',
							largeScreen: 'full',
						}}
					/>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
