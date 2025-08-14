// Libs
import React from 'react';
// Assets
import ArrowIcon from './assets/arrow.svg'; 
import CloseIcon from './assets/close.svg';
import InfoIcon from './assets/info.svg';
import InstaIcon from './assets/insta.svg';
import ChatOffIcon from './assets/chatOff.svg';
import ChatOnIcon from './assets/chatOn.svg';
import ConnectIcon from './assets/connect.svg';
import MoneyIcon from './assets/money.svg';
import UserListIcon from './assets/userList.svg';

const iconMap = {
  arrow: ArrowIcon,
  close: CloseIcon,
  info: InfoIcon,
  insta: InstaIcon,
  chatoff: ChatOffIcon,
  chaton: ChatOnIcon,
  connect: ConnectIcon,
  money: MoneyIcon,
  userlist: UserListIcon,
};

type IconName = keyof typeof iconMap;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  nome: IconName; 
}

export default function Icon({ nome, ...props }: IconProps) {
 
  const IconToRender = iconMap[nome];

  if (!IconToRender) {
    return null;
  }

  return <IconToRender {...props} />;
}