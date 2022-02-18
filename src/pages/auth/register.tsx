import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { signUp } from '@core/services/api';
import Auth from 'components/Auth';
import Layout from 'Layouts';
import Socials from 'components/Auth/Socials';

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

export default function Register() {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const onCheckbox = () => {
    // v will be true or false
  };
  const handleSignUp = (e: any) => {
    e.preventDefault();
    signUp({
      userName: userName,
      password: password,
    });
  };
  return (
    <Layout title="Register">
      <Auth title="Create new account">
        <form>
          <Input fullWidth>
            <input type="text" placeholder="Username" onChange={(e) => setUserName(e.target.value)} />
          </Input>
          <Input fullWidth>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </Input>
          <Input fullWidth>
            <input type="password" placeholder="Confirm Password" />
          </Input>
          <Checkbox checked onChange={onCheckbox}>
            Agree to{' '}
            <Link href="/">
              <a>Terms & Conditions</a>
            </Link>
          </Checkbox>
          <Button onClick={handleSignUp} shape="SemiRound" fullWidth>
            Register
          </Button>
        </form>
        <Socials />
        <p>
          Already have an account?{' '}
          <Link href="/auth/login">
            <a>Log In</a>
          </Link>
        </p>
      </Auth>
    </Layout>
  );
}
