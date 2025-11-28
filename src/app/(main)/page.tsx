import { getDashboardStats } from '@/actions/dashboard/get-stats';
import DashboardMenuCard from '@/components/DashboardMenuCard';
import { Activity, Flame, Trophy } from 'lucide-react';

export default async function Home() {
  const { user, caloriesBurned, netCalories, workoutsToday, streak, nextWorkout, motivation } = await getDashboardStats();

  const stats = [
    {
      label: 'Calories Burned',
      value: caloriesBurned.toLocaleString(),
      unit: 'kcal',
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      label: 'Workouts Today',
      value: workoutsToday.toString(),
      unit: 'sessions',
      icon: Activity,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Current Streak',
      value: streak.toString(),
      unit: 'days',
      icon: Trophy,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
    },
  ];

  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-lg'>
        <div className='relative z-10 max-w-4xl'>
          <h1 className='text-3xl md:text-4xl font-bold mb-4'>
            Welcome back, {user.name}<span className='whitespace-nowrap'>! 👋</span>
          </h1>
          <p className='text-indigo-100 text-lg mb-8'>
            {motivation}
          </p>

          <div className='flex flex-wrap gap-4'>
            <div className='bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20'>
              <span className='block text-sm text-indigo-200'>Net Calories</span>
              <span className='text-2xl font-bold'>{netCalories > 0 ? '+' : ''}{netCalories} kcal</span>
            </div>
            <div className='bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20'>
              <span className='block text-sm text-indigo-200'>Next Workout</span>
              <span className='text-xl font-semibold'>{nextWorkout}</span>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className='absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl' />
        <div className='absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black/10 rounded-full blur-3xl' />
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {stats.map((stat, index) => (
          <div key={index} className='bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow'>
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className='text-sm text-neutral-500'>{stat.label}</p>
              <div className='flex items-baseline gap-1'>
                <span className='text-2xl font-bold text-neutral-800'>{stat.value}</span>
                <span className='text-xs text-neutral-400 font-medium'>{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Menu Grid */}
      <div>
        <h2 className='text-xl font-bold text-neutral-800 mb-6'>Dashboard</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <DashboardMenuCard
            title='Workout Plan'
            description='Set up and manage your training plan.'
            imageSrc='/images/workout-plan.png'
            pageUrl='/workout-plan'
            className='bg-[#EBF8FD]'
          />

          <DashboardMenuCard
            title='Workout'
            description='Start and track your workouts.'
            imageSrc='/images/workout.png'
            pageUrl='/workout'
            className='bg-[#FFF4F3]'
          />

          <DashboardMenuCard
            title='Workout History'
            description='Review your past workouts.'
            imageSrc='/images/history.png'
            pageUrl='/workout-history'
            className='bg-[#FFF5DF]'
          />

          <DashboardMenuCard
            title='Diet Plan'
            description='Manage your food intake and diet plan.'
            imageSrc='/images/diet-plan.png'
            pageUrl='/diet-plan'
            className='bg-[#E1F4E2]'
          />
        </div>
      </div>
    </div>
  );
}
