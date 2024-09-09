import { Button } from "@nextui-org/react";
import Head from "next/head";

export default function CustomError() {
  return (
    <>
      <Head>
        <title>ERİŞİM REDDEDİLDİ</title>
      </Head>
      <div className="grid h-screen place-content-center  px-4 bg-gray-900">
        <div className="text-center">
          <h1 className="text-9xl font-black text-gray-700">404</h1>

          <p className="text-2xl font-bold tracking-tight sm:text-4xl text-white">
            Uh-oh!
          </p>

          <p className="mt-4 text-gray-400">
            Sayfaya bir sorun yüzünden ulaşılamadı. Bu hesabınıza normal olmayan
            yollarla erişmeye çalıştığınız için olabilir. Lütfen tekrar deneyin.
          </p>
          <a href="/" className="w-auto h-auto relative">
            <Button
              color="warning"
              variant="flat"
              size="lg"
              className="dark mt-2 w-auto h-12"
              href="/"
            >
              Ana Sayfaya Git
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}
