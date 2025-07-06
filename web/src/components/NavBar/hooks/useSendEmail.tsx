import React, { useState } from 'react';

export const useSendEmail = () => {
  const [form, setform] = useState('');
  const [result, setresult] = useState<'ok' | 'error' | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    setresult(null);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const subject = formData.get('subject');
    const email = formData.get('email');

    setresult('ok');

    form.reset();
  };

  const validateEmail = (email: string): boolean => {
    const regexEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regexEmail.test(email);
  };
};

export default useSendEmail;
