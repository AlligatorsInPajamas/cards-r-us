import { useState, useEffect } from 'react';

interface LoginInfo {
  isLoggedIn: boolean;
  user: null | object;
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
  const updateLogin = (fetchedData: { userId: string; id: string }) => {
    const defaultUser = {
      username: null,
      email: null,
      avatar: null,
      name: null,
      userId: null,
    };

    console.log('fetchedData', fetchedData);
    setLoginInformation({
      isLoggedIn: fetchedData?.userId !== null,
      user: { ...defaultUser, fetchedData, userId: fetchedData.id },
    });
  };

  return {
    isLoggedIn: loginInformation.isLoggedIn,
    user: loginInformation.user,
    updateLogin,
  };
}
