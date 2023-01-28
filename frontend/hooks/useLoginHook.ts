import { useState, useEffect } from 'react';

interface User {
  username: string | null;
  email?: string | null;
  avatar?: string | null;
  name?: string | null;
  userId: string | null;
}
interface LoginInfo {
  isLoggedIn: boolean;
  user: User | null;
}

export default function useLoginState() {
  const [loginInformation, setLoginInformation] = useState<LoginInfo>({
    isLoggedIn: false,
    user: null,
  });

  /**
   *
   * @param {{
   * username: string | null,
   * email?: string | null,
   * avatar?: string | null,
   * name?: string | null,
   * userId: string | null,
   * }} user
   */
  const updateLogin = (fetchedData: User) => {
    const defaultUser = {
      username: null,
      email: null,
      avatar: null,
      name: null,
      userId: null,
    };

    setLoginInformation({
      isLoggedIn: fetchedData?.userId !== null,
      user: { ...defaultUser, ...fetchedData },
    });
  };

  return {
    isLoggedIn: loginInformation.isLoggedIn,
    user: loginInformation.user,
    updateLogin,
  };
}
