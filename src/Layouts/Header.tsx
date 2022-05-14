import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled, { DefaultTheme } from 'styled-components';
import Select from '@paljs/ui/Select';
import { LayoutHeader } from '@paljs/ui/Layout';
import { EvaIcon } from '@paljs/ui/Icon';
import { Actions } from '@paljs/ui/Actions';
import ContextMenu from '@paljs/ui/ContextMenu';
import User from '@paljs/ui/User';
import { breakpointDown } from '@paljs/ui/breakpoints';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

const HeaderStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  ${breakpointDown('sm')`
    .right{
      display: none;
    }
  `}
  .right > div {
    height: auto;
    display: flex;
    align-content: center;
  }
  .logo {
    font-size: 1.25rem;
    white-space: nowrap;
    text-decoration: none;
  }
  .left {
    display: flex;
    align-items: center;
    .github {
      font-size: 18px;
      margin-right: 5px;
    }
  }
`;

const Label = styled.span`
  display: flex;
  align-items: center;
`;

const SelectStyled = styled(Select)`
  min-width: 150px;
`;

interface HeaderProps {
  backButton?: boolean;
  homeBtnUrl?: string;
  backButtonUrl?: string;
  toggleSidebar: () => void;
  theme: {
    set: (value: DefaultTheme['name']) => void;
    value: DefaultTheme['name'];
  };
  changeDir: () => void;
  dir: 'rtl' | 'ltr';
}

interface UserInfo {
  name: string;
  roleTitle: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const router = useRouter();
  const themeOptions = () => [
    {
      value: 'default',
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: '#a6c1ff' }} />
          Default
        </Label>
      ),
    },
    {
      value: 'dark',
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: '#192038' }} />
          Dark
        </Label>
      ),
      selected: true,
    },
  ];

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'user',
    roleTitle: 'none',
  });

  useEffect(() => {
    const username = localStorage.getItem('username')!;
    setUserInfo({ ...userInfo, name: username });
  }, []);

  return (
    <LayoutHeader fixed>
      <HeaderStyle>
        {props.backButton ? (
          <Actions
            size="Medium"
            actions={[
              {
                icon: { name: 'home-outline' },
                url: {
                  onClick: () => router.push(props.homeBtnUrl ?? '/'),
                },
              },
              {
                icon: { name: 'chevron-left-outline' },
                url: {
                  onClick: () => router.push(props.backButtonUrl ?? '/'),
                },
              },
            ]}
          />
        ) : (
          <Actions
            size="Medium"
            actions={[
              {
                icon: { name: 'menu-2-outline' },
                url: {
                  onClick: props.toggleSidebar,
                },
              },
              // {
              //   content: (
              //     <SelectStyled
              //       instanceId="react-select-input"
              //       isSearchable={false}
              //       shape="SemiRound"
              //       placeholder="Themes"
              //       value={themeOptions().find((item) => item.value === props.theme.value)}
              //       options={themeOptions()}
              //       onChange={({ value }: { value: DefaultTheme['name'] }) => props.theme.set(value)}
              //     />
              //   ),
              // },
            ]}
          />
        )}
        <Actions
          size="Small"
          className="right"
          actions={[
            {
              content: (
                <ContextMenu
                  nextJs
                  style={{ cursor: 'pointer' }}
                  placement="bottom"
                  currentPath={router.pathname}
                  items={[
                    { title: 'Người dùng', link: { href: '/modal-overlays/tooltip' } },
                    { title: 'Đăng xuất', link: { href: '/logout' } },
                  ]}
                  Link={Link}
                >
                  <User
                    image="url('/icons/icon-72x72.png')"
                    name={userInfo.name}
                    title={""}
                    size="Medium"
                  />
                </ContextMenu>
              ),
            },
          ]}
        />
      </HeaderStyle>
    </LayoutHeader>
  );
};
export default Header;
