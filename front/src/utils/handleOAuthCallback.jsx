export const handleOAuthCallback = (getUserData, token, expiresIn, setIsLoggedIn, navigate) => {
  if (!token) {
    console.error('No token found');
    return;
  }

  getUserData(token)
    .then((data) => {
      setIsLoggedIn(true);
      const expirationTime = new Date().getTime() + (expiresIn * 1800000); // 만료 시간 계산
      // 사용자 정보를 localStorage에 저장
      localStorage.setItem('user', JSON.stringify({ ...data, expirationTime }));
      // /create 페이지로 이동
      navigate('/create');
    })
    .catch((error) => {
      console.error('Error during OAuth login:', error);
    });
};
