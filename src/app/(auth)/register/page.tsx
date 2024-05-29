import RegisterForm from "@/app/(auth)/register/register-form";

export default function RegisterPage() {
  return (
    <>
      <h1 className='text-xl font-semibold text-center '>Đăng ký</h1>
      <div className='flex justify-center'>
        <RegisterForm />
      </div>
    </>
  );
}
