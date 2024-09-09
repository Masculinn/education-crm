import { BreadcrumbItem, Breadcrumbs, Code } from "@nextui-org/react";

export const RotateBar = ({ items, style, description, error_code }) => {
  return (
    <>
      <div className={`w-full h-auto ${style} mb-2`}>
        <Breadcrumbs
          className="dark"
          size="lg"
          variant="bordered"
          radius="full"
          color="foreground"
          classNames={{
            list: "px-8",
          }}
        >
          {items.map((val, idx) => (
            <BreadcrumbItem key={idx}>{val}</BreadcrumbItem>
          ))}
        </Breadcrumbs>
      </div>
      <p className="w-full h-auto mt-4 ">{description}</p>
      <br />
      <div className="w-full h-auto items-center justify-start text-sm">
        <span>
          Bu bölümde herhangi bir problem yaşamanız durumunda yukarıdan{" "}
          <b className="text-danger-400">Teknik Hata Raporu Düzenle</b>{" "}
          kısmındaki hata kodu kısmına bunu yazın{" "}
          <Code color="danger" className="dark mt-1" size="sm">
            Hata Kodu: {error_code}
          </Code>{" "}
        </span>
      </div>
    </>
  );
};
