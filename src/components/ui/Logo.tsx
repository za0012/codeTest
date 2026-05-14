import Image from "next/image";
import LogoImg from "../../../public/Logo.png";

interface LogoType {
  size: number;
}

const Logo = ({ size }: LogoType) => {
  return (
    <Image
      src={LogoImg}
      width={size}
      height={size}
      alt="Picture of the author"
    />
  );
};

export default Logo;
