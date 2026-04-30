import React from 'react'
import { assets } from '../../assets/assets'

const Why = () => {
  return (
    <div className='my-12'>
      <div className="py-10 px-4 bg-white rounded-xl shadow-md">
        <h2>Why Choose TaxBuddy?</h2>
        <div className="md:flex sm:flex justify-between">
            <div className='flex flex-col gap-8 mt-8'>
                <div className="flex gap-5">
                    <img src={assets.taxExperticon} className='w-12 h-12' alt="" />
                    <div className="text-[#4a5565] max-w-135">
                        <h3 className="text-black text-[18px] md:text-xl mb-1 font-medium">Expert Tax Profetionals</h3>
                        <p>
                        Our team includes chartered accountants and certified tax
                        practitioners with deep knowledge of Nigerian tax laws.
                        </p>
                    </div>
                </div>
                <div className="flex gap-5">
                    <img src={assets.energyIcon} className='w-12 h-12' alt="" />
                    <div className="text-[#4a5565] max-w-135">
                        <h3 className="text-black text-[18px] md:text-xl mb-1 font-medium">Expert Tax Profetionals</h3>
                        <p>
                        Our team includes chartered accountants and certified tax
                        practitioners with deep knowledge of Nigerian tax laws.
                        </p>
                    </div>
                </div>
                <div className="flex gap-5">
                    <img src={assets.costIcon} className='w-12 h-12' alt="" />
                    <div className="text-[#4a5565] max-w-135">
                        <h3 className="text-black text-[18px] md:text-xl mb-1 font-medium">Expert Tax Profetionals</h3>
                        <p>
                        Our team includes chartered accountants and certified tax
                        practitioners with deep knowledge of Nigerian tax laws.
                        </p>
                    </div>
                </div>
                <div className="flex gap-5">
                    <img src={assets.complianceIcon} className='w-12 h-12' alt="" />
                    <div className="text-[#4a5565] max-w-135">
                        <h3 className="text-black text-[18px] md:text-xl mb-1 font-medium">Expert Tax Profetionals</h3>
                        <p>
                        Our team includes chartered accountants and certified tax
                        practitioners with deep knowledge of Nigerian tax laws.
                        </p>
                    </div>
                </div>
                <button className="bg-primary py-4 px-8 text-white rounded-lg font-medium md:max-w-96">Start Consultation Now!</button>
            </div>
            <img src={assets.serviceImg} className='mt-6' alt="" />
        </div>
      </div>
    </div>
  )
}

export default Why
