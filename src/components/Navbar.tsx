'use client';

import { logout } from '@/actions/auth/logout';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu';
import {
  Dumbbell,
  History,
  LayoutDashboard,
  User,
  Utensils,
  Menu,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export default function Navbar({ name }: { name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const res = await logout();

    if (res.status === 200 && res.success) {
      router.push('/login');
    }
  };

  return (
    <div className='flex justify-between items-center py-4'>
      <Link href={'/'} className='text-3xl md:text-4xl font-black'>
        FitTrack
      </Link>

      {/* Desktop menu */}
      <div className='hidden lg:flex'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className='hover:bg-transparent p-0'>
                <Link href='/'>
                  <Button variant='ghost' className='p-0 gap-2'>
                    <LayoutDashboard /> Dashboard
                  </Button>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className='hover:bg-transparent p-0'>
                <Link href='/workout-plan'>
                  <Button variant='ghost' className='p-0 gap-2'>
                    <Dumbbell /> Workout Plan
                  </Button>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className='hover:bg-transparent p-0'>
                <Link href='/workout-history'>
                  <Button variant='ghost' className='p-0 gap-2'>
                    <History /> History
                  </Button>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className='hover:bg-transparent p-0'>
                <Link href='/diet-plan'>
                  <Button variant='ghost' className='p-0 gap-2'>
                    <Utensils /> Diet Plan
                  </Button>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className='hover:bg-transparent p-0'>
                <Link href='/profile'>
                  <Button variant='ghost' className='p-0 gap-2'>
                    <User /> Profile
                  </Button>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Desktop user */}
      <div className='hidden lg:flex items-center space-x-4'>
        <Avatar asChild className='size-10 md:size-12'>
          <Link href='/profile'>
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Link>
        </Avatar>

        <div className='flex flex-col'>
          <span className='text-base text-neutral-600 font-medium'>{name}</span>
          <span
            onClick={handleLogout}
            className='text-base text-red-700 cursor-pointer'
          >
            Logout
          </span>
        </div>
      </div>

      <Button type='button' className='lg:hidden' onClick={() => setOpen(true)}>
        <Menu />
      </Button>

      <div
        className={`absolute  ${
          open ? 'top-0' : '-top-[100%]'
        } left-0 w-full bg-white border-b p-4  transition-all duration-300 ease-in-out z-50`}
      >
        <div className='container flex flex-col gap-4 lg:hidden'>
          <Button
            type='button'
            className='lg:hidden w-max self-end'
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>

          <Link href='/' onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <Link href='/workout-plan' onClick={() => setOpen(false)}>
            Workout Plan
          </Link>
          <Link href='/workout-history' onClick={() => setOpen(false)}>
            History
          </Link>
          <Link href='/diet-plan' onClick={() => setOpen(false)}>
            Diet Plan
          </Link>
          <Link href='/profile' onClick={() => setOpen(false)}>
            Profile
          </Link>

          <div className='border-t pt-4'>
            <p className='font-medium'>{name}</p>
            <p onClick={handleLogout} className='text-red-700 cursor-pointer'>
              Logout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
