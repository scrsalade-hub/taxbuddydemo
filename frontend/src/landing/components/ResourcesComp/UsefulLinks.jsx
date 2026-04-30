import React from "react";
import { assets } from '../../assets/assets';

const UsefulLinks = () => {
  const links = [
    {
      title: "Nigerian Tax Laws and Regulations",
      description: "Access to complete tax legislatory regulations",
      url: "https://www.firs.gov.ng/laws-regulations/",
    },
    {
      title: "Corporate Affairs Commission(CAC)",
      description: "Business registration & incorporation services",
      url: "https://www.cac.gov.ng/",
    },
    {
      title: "Federal Inland Revenue Service (FIRS)",
      description: "Official website for Nigeria's tax authority",
      url: "https://www.firs.gov.ng/",
    },
    {
      title: "FIRS Online Tax Portal",
      description: "File returns and manage your tax profile online",
      url: "https://www.firs.gov.ng/online-services/",
    },
  ];

  return (
    <div className="my-8 flex flex-col gap-6 items-center">
      <h3 className="text-[24px] font-medium text-primary">Useful Links</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {links.map((link, index) => (
        
          <div key={index}  className="bg-white flex flex-col gap-3 rounded-xl shadow px-4 py-5 w-fit">
            <h3 className="text-[15px]">{link.title}</h3>
            <p>{link.description}</p>

            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-secondary font-normal cursor-pointer"
            >
              <span>Visit Website</span>
              <img src={assets.downloadLinkIcon} className="w-4 h-4" />
            </a>
          </div>
        
      ))}

      </div>
    </div>
  );
};

export default UsefulLinks;
