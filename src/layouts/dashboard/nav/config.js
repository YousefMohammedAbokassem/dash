import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'driver',
    path: '/dashboard/driver',
    icon: icon('driver'),
  },
  {
    title: 'category',
    path: '/dashboard/category',
    icon: icon('category-svgrepo-com'),
  },
  {
    title: 'specialCategory',
    path: '/dashboard/specialCategory',
    icon: icon('category-svgrepo-com'),
  },
  {
    title: 'City',
    path: '/dashboard/city',
    icon: icon('city'),
  },
  {
    title: 'Intervals',
    path: '/dashboard/intervals',
    icon: icon('interval'),
  },
  {
    title: 'place',
    path: '/dashboard/place',
    icon: icon('maps-01'),
  },
  {
    title: 'globalSetting',
    path: '/dashboard/globalSetting',
    icon: icon('setting'),
  },
  {
    title: 'logout',
    path: '/login',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'logout',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
];

export default navConfig;
