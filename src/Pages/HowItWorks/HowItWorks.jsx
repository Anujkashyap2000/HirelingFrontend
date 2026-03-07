import React from 'react';

const HowItWorksPage = () => {
  const customerSteps = [
    {
      title: "Sign Up",
      description: "Create your account as a Customer by filling out a simple registration form.",
      icon: "📝"
    },
    {
      title: "Find a Worker",
      description: "Search for available workers in your area using your pincode or by their specific profession.",
      icon: "🔍"
    },
    {
      title: "Request Appointment",
      description: "Provide basic details about the work you need done and send an appointment request to the worker.",
      icon: "📅"
    },
    {
      title: "Confirm Booking",
      description: "Once the worker accepts your request, finalize the booking straight from your customer profile.",
      icon: "✅"
    },
    {
      title: "Verify & Complete",
      description: "After the worker completes the job, share the secure verification code found on your booking card to mark the job as finished.",
      icon: "🔐"
    }
  ];

  const workerSteps = [
    {
      title: "Register Profile",
      description: "Sign up as a Worker, list your profession, and set your service area using your pincode.",
      icon: "👷"
    },
    {
      title: "Receive Requests",
      description: "Get notified when customers in your area request your specific skills and services.",
      icon: "🔔"
    },
    {
      title: "Accept Jobs",
      description: "Review the work details provided by the customer and accept the appointment requests that fit your schedule.",
      icon: "🤝"
    },
    {
      title: "Complete the Work",
      description: "Travel to the customer's site, perform the requested service, and ensure they are satisfied.",
      icon: "🛠️"
    },
    {
      title: "Enter Verification Code",
      description: "Ask the customer for their unique verification code to officially close the job and get credited for completion.",
      icon: "📱"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          How It Works
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Whether you need a job done or you're looking for work, getting started is simple. Choose your role below to see your steps.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Customer Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 py-6 px-8 text-center">
            <h2 className="text-2xl font-bold text-white">For Customers</h2>
            <p className="text-blue-100 mt-2">Find and book trusted workers easily.</p>
          </div>
          <div className="p-8">
            <div className="space-y-8">
              {customerSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="mt-1 text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Worker Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-emerald-600 py-6 px-8 text-center">
            <h2 className="text-2xl font-bold text-white">For Workers</h2>
            <p className="text-emerald-100 mt-2">Find jobs and manage your appointments.</p>
          </div>
          <div className="p-8">
            <div className="space-y-8">
              {workerSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="mt-1 text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowItWorksPage;