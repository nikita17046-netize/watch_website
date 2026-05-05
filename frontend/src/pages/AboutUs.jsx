import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, ShieldCheck, Gem, Users, History } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { label: 'Years of Excellence', value: '15+', icon: History },
    { label: 'Luxury Timepieces', value: '5000+', icon: Clock },
    { label: 'Happy Clients', value: '10k+', icon: Users },
    { label: 'Certified Partners', value: '25+', icon: ShieldCheck },
  ];

  const values = [
    {
      title: 'Uncompromising Quality',
      description: 'Every timepiece in our collection undergoes rigorous multi-point inspections by master horologists.',
      icon: Award
    },
    {
      title: 'Exclusivity',
      description: 'We specialize in sourcing rare and limited edition pieces that define status and character.',
      icon: Gem
    },
    {
      title: 'Lifetime Trust',
      description: 'Our relationship with clients extends far beyond the point of sale, offering dedicated concierge support.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="bg-white text-black min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2000')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[var(--luxury-gold)] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Our Heritage</span>
            <h1 className="text-5xl md:text-8xl font-playfair font-black text-white mb-8 tracking-tight">
              Crafting <span className="italic text-[var(--luxury-gold)] text-shadow-glow">Time</span>,<br />
              Defining <span className="italic">Legacy</span>.
            </h1>
            <p className="max-w-2xl mx-auto text-gray-300 text-sm md:text-base font-medium leading-relaxed tracking-wide">
              Since our inception, LUXE has been the sanctuary for those who seek more than just a watch—they seek a story, a statement, and a timeless investment.
            </p>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[var(--luxury-gold)] to-transparent"></div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 group-hover:bg-[var(--luxury-gold)] transition-colors duration-500">
                  <stat.icon size={20} className="text-gray-400 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-3xl font-playfair font-black mb-1">{stat.value}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000" 
                    alt="Watch Crafting" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white p-8 rounded-[2rem] shadow-xl hidden lg:block">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Master Watchmaker</p>
                  <p className="font-playfair italic text-lg leading-snug">
                    "A watch is the only piece of art that lives and breathes with the wearer."
                  </p>
                </div>
              </motion.div>
            </div>
            
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[var(--luxury-gold)] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">The Philosophy</span>
                <h2 className="text-4xl font-playfair font-black mb-8 leading-tight">Beyond The Dial: Our Commitment to Artistry</h2>
                <p className="text-gray-600 text-sm mb-12 leading-relaxed tracking-wide">
                  At LUXE, we believe that a timepiece is more than a tool for measurement. It is an engineering marvel, a piece of wearable art, and a testament to human ingenuity. We curate collections that represent the pinnacle of horological achievement.
                </p>

                <div className="space-y-8">
                  {values.map((value, index) => (
                    <div key={value.title} className="flex gap-6">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
                        <value.icon size={18} className="text-[var(--luxury-gold)]" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest mb-2">{value.title}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-playfair font-black mb-10 italic">"Time is the ultimate luxury."</h2>
            <div className="w-24 h-[1px] bg-[var(--luxury-gold)] mx-auto mb-10"></div>
            <p className="text-gray-500 text-sm md:text-base font-medium tracking-wide leading-loose">
              Our vision is to remain the world's most trusted destination for high-end horology, bridging the gap between historical craftsmanship and modern innovation. Whether you are a seasoned collector or a first-time buyer, we provide an unparalleled concierge experience tailored to your unique journey.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-playfair font-black text-gray-50/50 -z-0 select-none whitespace-nowrap">
          LUXE REGISTRY
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-black text-white text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-6"
        >
          <h2 className="text-2xl font-playfair font-black uppercase tracking-[0.3em] mb-8">Begin Your Journey</h2>
          <button className="px-12 py-5 bg-[var(--luxury-gold)] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all duration-500 rounded-full">
            Explore Collection
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
