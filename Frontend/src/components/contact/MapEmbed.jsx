import React from 'react';

function MapEmbed() {
  return (
    <>
      <section className="w-full py-10">
        <div className="w-full h-112.5 rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d594.7489459841471!2d73.02396967788972!3d19.183500403038742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bf1040000001%3A0x2bb26603d961a4!2sRose%20Garment!5e0!3m2!1sen!2sin!4v1769571303677!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </>
  );
}

export default MapEmbed