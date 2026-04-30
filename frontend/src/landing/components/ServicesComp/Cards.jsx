import React from 'react'
import { assets } from '../../assets/assets'
const services = [
    {
        img: assets.docIcon,
        tittle: 'Tax Filling Services',
        texts: 'Complete tax return preparation & filing for all Nigerian business tax types. We ensure accuracy & timely submission to FIRS.',
        checkicon: assets.checkIcon,
        l1: 'Monthly VAT Returns',
        l2: 'Annual CIT Returns',
        l3: 'WHT Fillings',
        l4: 'PAYE Remittances'
    },
    {
        img: assets.calIcon,
        tittle: 'Tax Plannig Optimization',
        texts: 'Strategic tax planning to minimize liabilities while maintaining full compliance with Nigerian tax laws.',
        checkicon: assets.checkIcon,
        l1: 'Tax Strategy Review',
        l2: 'Deduction Maximization',
        l3: 'Incentive Identification',
        l4: 'Cash Flow Planning'
    },
    {
        img: assets.bookIcon,
        tittle: 'Tax Compliance Review',
        texts: 'Regular reviews of your tax compliance status. Identify and fix issues before they become problems.',
        checkicon: assets.checkIcon,
        l1: 'Compliance Audits',
        l2: 'Risk Assessment',
        l3: 'Remediation Plans',
        l4: 'Best Practices'
    },
    {
        img: assets.peopleIcon,
        tittle: 'Payroll Tax Management',
        texts: 'Comprehensive PAYE and employee tax management. Automated calculations and timely remittances.',
        checkicon: assets.checkIcon,
        l1: 'PAYE Calculation',
        l2: 'Pension Compliance',
        l3: 'NHF Management',
        l4: 'Monthly Remittances'
    },
    {
        img: assets.bagIcon,
        tittle: 'Business Tax Advisory',
        texts: 'Expert advice on tax implications of business decisions. From expansion to restructuring.',
        checkicon: assets.checkIcon,
        l1: 'M&A Tax Advice',
        l2: 'Structure Planning',
        l3: 'Transfer Pricing',
        l4: 'International Tax'
    },
    {
        img: assets.badgeIcon,
        tittle: 'Audit Support & Defense',
        texts: 'Professional representation during FIRS audits and tax investigations. We protect your interests and ensure fair treatment.',
        checkicon: assets.checkIcon,
        l1: 'Audit Preparation',
        l2: 'Documentation Support',
        l3: 'FIRS Negotiations',
        l4: 'Appeal Assitance'
    },
]

const Cards = () => {
  return (
    <div className='grid md:grid-cols-3 grid-cols-1 gap-4 md:gap-8 mt-8'>
      {services.map((service, index)=>(
        <div key={index} className="bg-white rounded-xl shadow flex flex-col gap-6 text-[#4A5565] p-6">
            <img src={service.img} className='w-12 h-12'/>
            <h3 className='text-black'>{service.tittle}</h3>
            <p>{service.texts}</p>
            <ul>
                <li className='flex gap-3'>
                    <img src={service.checkicon} alt="" />
                    <p>{service.l1}</p>
                </li>
                <li className='flex gap-3'>
                    <img src={service.checkicon} alt="" />
                    <p>{service.l2}</p>
                </li>
                <li className='flex gap-3'>
                    <img src={service.checkicon} alt="" />
                    <p>{service.l3}</p>
                </li>
                <li className='flex gap-3'>
                    <img src={service.checkicon} alt="" />
                    <p>{service.l4}</p>
                </li>
                
            </ul>
        </div>
      ))}
    </div>
  )
}

export default Cards
