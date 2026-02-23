// Pomocne funkcije za AuthContext
export const extractAuthPayload = (data) => {
  const payload = data?.data ?? data?.user ?? data;
  const tokenFromResponse = data?.token ?? payload?.token;
  const userFromResponse = payload?.user ?? payload;

  if (userFromResponse && userFromResponse.token) {
    const { token: embeddedToken, ...rest } = userFromResponse;
    return {
      token: tokenFromResponse || embeddedToken,
      user: rest
    };
  }

  return { token: tokenFromResponse, user: userFromResponse };
};
