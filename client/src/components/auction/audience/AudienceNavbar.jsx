import { assets } from "../../../assets/assets";
import { Link } from "react-router-dom";

const AudienceNavbar = () => {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <Link to="/">
        <img src={assets.logo} className="w-28 lg:w-32" alt="" />
      </Link>

      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi! Admin</p>
        {<img className="max-w-8" src={assets.profile_img} />}
      </div>
    </div>
  );
};
export default AudienceNavbar;
