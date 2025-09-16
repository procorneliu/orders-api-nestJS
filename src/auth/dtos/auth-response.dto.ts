export class AuthResponseDto {
  userData: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };

  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
