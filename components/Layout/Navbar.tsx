import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { navItems } from '@/data';
import { logo, search, close } from '@/assets';

const Navbar = () => {
	const router = useRouter();
	const [selectedPage, setSelectedPage] = useState<string>('home');
	const [searchDrawer, setSearchDrawer] = useState<boolean>(false);

	return (
		<nav className='w-full border-b-2 border-[#3F3F46]'>
			{/* Full Screen Navigation*/}
			<div className='max-w-screen-xl mx-auto hidden md:flex flex-row justify-between text-white py-4 px-8'>
				<div className='flex gap-4 items-center'>
					<Link href='/'>
						<Image src={logo} alt='socialorbit' width={38} />
					</Link>
					<div className='relative'>
						<span className='absolute inset-y-0 start-0 grid place-content-center px-4'>
							<Image src={search} alt='search' width={20} />
						</span>
						<input
							type='text'
							className='w-full rounded-xl bg-[#18181B] p-2 pe-6 ps-12 text-sm text-white shadow-sm border-[1px] border-[#3F3F46] focus:outline-none font-circularRegular'
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
			{/* Small Screen Navigation*/}
			<div className='max-w-screen-xl mx-auto flex md:hidden flex-row justify-between text-white py-4 px-8 items-center'>
				<div>
					<Image
						src={!searchDrawer ? search : close}
						alt='search'
						width={24}
						onClick={() => setSearchDrawer(!searchDrawer)}
					/>
				</div>
				<div>
					<Image src={logo} alt='socialorbit' width={36} />
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
			{searchDrawer && (
				<div className='relative m-4 md:hidden'>
					<span className='absolute inset-y-0 start-0 grid place-content-center px-4'>
						<Image src={search} alt='search' width={20} />
					</span>
					<input
						type='text'
						className='w-full rounded-xl bg-[#18181B] p-2 pe-6 ps-12 text-sm text-white shadow-sm border-[1px] border-[#3F3F46] focus:outline-none font-circularRegular'
						placeholder='Search...'
					/>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
