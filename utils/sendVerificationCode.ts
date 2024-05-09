import axios from 'axios';
import { onlyNumbers } from './onlyNumbers';

type BodyParams = {
  phone_number: string;
  service_name: string;
};

interface ResponseData {
  data: {
    data: { verification_code: string; expires: number; ok: boolean };
    ok: boolean;
  };
}

export const sendVerificationCode = async (
  phone: string
): Promise<{ success: boolean; message: string }> => {
  const send_code_url = 'https://textflow.me/api/send-code';
  if (!phone) return { success: false, message: 'Phone number is required' };
  const formattedPhone = onlyNumbers(phone);
  if (formattedPhone.length !== 10) return { success: false, message: 'Phone number is invalid' };

  const params: BodyParams = {
    phone_number: `+1${formattedPhone}`,
    service_name: 'Your Deli',
  };

  try {
    const res = await axios.post<BodyParams, ResponseData>(send_code_url, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SMS_SECRET}`, //Bearer
      },
    });

    const { data, ok } = res.data;

    return {
      success: ok,
      message: data.verification_code || '',
    };
  } catch (error) {
    console.log(error);
    const err = error as Error;
    return { success: false, message: err.message };
  }
};
