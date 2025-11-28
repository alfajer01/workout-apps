import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardMenuCard({
  title,
  description,
  imageSrc,
  pageUrl = '#',
  className,
}: {
  title: string;
  description: string;
  imageSrc: string;
  pageUrl?: string;
  className?: string;
}) {
  return (
    <Link
      href={pageUrl}
      className={cn(
        'group relative flex flex-col items-center text-center p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden',
        'bg-white border border-neutral-100', // Default base style
        className
      )}
    >
      <div className="relative z-10 mb-6 p-4 rounded-full bg-white/50 backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform duration-300">
        <Image
          src={imageSrc}
          alt={title}
          width={150}
          height={150}
          className='w-20 h-20 object-contain'
        />
      </div>

      <h3 className='text-xl font-bold text-neutral-800 group-hover:text-primary transition-colors relative z-10'>
        {title}
      </h3>

      <p className='mt-3 text-sm text-neutral-500 leading-relaxed max-w-[200px] relative z-10'>
        {description}
      </p>

      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  );
}
