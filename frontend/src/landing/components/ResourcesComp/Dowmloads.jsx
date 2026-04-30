import React from "react";
import { assets } from '../../assets/assets';

const Dowmloads = () => {
  const downloads = [
    {
      icon: assets.downloadbook,
      head: "Nigerian Business Tax Guide 2025",
      text: "Complete guide covering all tax types, rates, and filing requirements.",
      size: "PDF . 2.5MB",
      file: "/assets/pdfs/Nigeria_Tax_Guide_2024.pdf",
    },
    {
      icon: assets.downloadCheck,
      head: "VAT Compliance Checklist",
      text: "Monthly checklist to ensure you never miss a VAT filing deadline.",
      size: "PDF . 450KB",
      file: "/assets/pdfs/VAT_Compliance_Checklist.pdf",
    },
    {
      icon: assets.downloadCalender,
      head: "Tax Calendar 2025",
      text: "All important tax deadlines and filing dates for Nigerian business.",
      size: "PDF . 1.2MB",
      file: "/assets/pdfs/Tax_Calendar_2024.pdf",
    },
    {
      icon: assets.downloadStats,
      head: "Small Business Tax Tips",
      text: "Essential tax tips for small business owners in Nigeria.",
      size: "PDF . 850KB",
      file: "/assets/pdfs/Small_Business_Tax_Tips.pdf",
    },
  ];

  const handleDownload = (file, name) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = name.replace(/\s+/g, '_') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="max-width-[392px] flex flex-col gap-4 items-center justify-center text-center">
        {/* Title Section */}
        <h2>Tax Resources & Downloads</h2>
        <div className="px-5">
          <p className="text-[#4a5565] md:text-[18px]">
            Free guides, templates, and links to help you navigate Nigerian
            business taxes
          </p>
        </div>
      </div>

      <section>
        {/* Download Items */}
        <div className="flex gap-2 items-center mt-16">
          <img src={assets.downloadIcon} alt="" />
          <h3 className="text-[16px]">Free Downloads</h3>
        </div>
        {downloads.map((download, index) => (
          <div className="mt-6 grid grid-cols-1 gap-2" key={index}>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex gap-8">
              <img className="w-9 h-10" src={download.icon} alt={download.head} />
              <div className="flex flex-col gap-3 w-full">
                <h3 className="text-[18px]">{download.head}</h3>
                <p className="text-[#4a5565] text-[13px] md:text-[15px]">
                  {download.text}
                </p>
                <div className="flex justify-between items-center w-full">
                  <span className="text-[12px] md:text-sm text-gray-500">
                    {download.size}
                  </span>
                  <button
                    onClick={() => handleDownload(download.file, download.head)}
                    className="border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <img src={assets.downloadLinkIcon} alt="" className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dowmloads;
