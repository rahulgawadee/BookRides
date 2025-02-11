import React, { useState } from "react";

export default function About() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-300 text-black flex flex-col items-center py-10 px-5">
            <h3 className="text-3xl font-bold text-center text-black mb-6">
                Frequently Asked Questions
            </h3>
            <div className="w-full max-w-2xl space-y-4">
                {faqData.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg">
                        <button
                            className="w-full text-left p-4 bg-black hover:bg-blue-500 transition-all duration-300 text-white font-semibold flex justify-between items-center"
                            onClick={() => toggleFAQ(index)}
                        >
                            {item.question}
                            <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
                        </button>
                        {openIndex === index && (
                            <div className="p-4 border-t border-gray-700">{item.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const faqData = [
    {
        question: "What are the documents that I need to submit to rent a bike?",
        answer: (
            <div>
                <strong>Following documents need to be submitted before you rent the bike:</strong><br />
                (1) Driving License will be verified in original.<br />
                (2) Original ID proof (Passport, Voter ID, Driving License) needs to be deposited.<br />
                (3) Passport needs to be deposited for bikes above 500cc (Mandatory).<br /><br />
                <strong>For International Visitors:</strong><br />
                (1) Valid Driving License from their home country with international riding permit, and a valid Visa. (Original to be brought).<br />
                (2) Passport needs to be deposited (Mandatory).<br />
            </div>
        )
    },
    {
        question: "What is your cancellation policy?",
        answer: (
            <div>
                Notify us at least 24 hours before your scheduled rental start time to receive a full refund.<br /><br />
                For cancellations made less than 24 hours in advance, a 50% refund will be issued.<br />
                No refunds will be provided for cancellations made after the scheduled rental start time or for no-shows.<br /><br />
                Refunds will be processed using the original payment method.<br />
                Please allow up to 7 business days for the refund to appear in your account.
            </div>
        )
    },
    {
        question: "Can I return the bike early?",
        answer: "Yes, you can return the bike early. However, we do not offer refunds for early returns."
    },
    {
        question: "Can I rent a bike for multiple days?",
        answer: "Yes, you can rent a bike for multiple days. Simply select the desired rental dates when making your reservation."
    },
    {
        question: "What types of bikes do you offer for rent?",
        answer: "We offer a variety of bikes, including lower cc bikes, higher cc sports bikes, naked sports bikes, scooters, and electric bikes, to suit your riding preferences."
    },
    {
        question: "Will I get a complimentary Helmet?",
        answer: (
            <div>
                <strong>Yes. BookMyRide provides one helmet with each booking.</strong><br />
                Second helmet will be provided at Rs.100/day, if needed. Both Helmets are subject to availability. Rs. 1000 deposit needs to be paid for each helmet.<br /><br />
                If the helmet is damaged or lost, a minimum charge of Rs. 1000 will be levied.<br /><br />
                <strong>Note:</strong> Deposits paid through UPI shall be returned in a maximum of 24 hours. Deposits paid through cash shall be returned immediately during bike return.
            </div>
        )
    }
];
