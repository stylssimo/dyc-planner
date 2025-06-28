

const Hero = () => {
    return (
        <section
            className="relative bg-cover bg-center h-[80vh] flex items-center justify-center text-white text-center"
            style={{ backgroundImage: "url('trip_hero_image.webp')" }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative z-10 max-w-2xl px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Turning Travel Dreams Into Reality & Unforgettable Adventures
                </h1>
            </div>
        </section>
    );
};

export default Hero;
