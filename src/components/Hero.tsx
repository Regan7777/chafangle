import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="pt-12 pb-8 border-b border-black/[0.08]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
          VPN查房
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#6e6e73] max-w-2xl leading-relaxed">
          围绕机场选购、服务评测、客户端配置与网络排查，整理从选择到使用的实用说明。
        </p>
      </div>
    </section>
  );
};
