import React from 'react'

const AboutUs = () => {
    return (
        <div className="about-page" style={{ paddingBottom: '4rem' }}>

            {/* Hero Section */}
            <div style={{
                backgroundColor: '#f8f9fa',
                padding: '4rem 0',
                textAlign: 'center',
                marginBottom: '3rem'
            }}>
                <div className="container">
                    <h1 style={{ fontWeight: 800, color: 'var(--text-color)', marginBottom: '1rem', fontSize: '2.5rem' }}>About FurniDecor</h1>
                    <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                        Crafting comfort and style for every home. We believe furniture is more than just functional—it's an expression of who you are.
                    </p>
                </div>
            </div>

            <div className="container">

                {/* Our Story */}
                <div className="row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '4rem' }}>
                    <div style={{ flex: '1 1 400px', paddingRight: '2rem', marginBottom: '2rem' }}>
                        <h2 style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '1.5rem' }}>Our Story</h2>
                        <p style={{ lineHeight: '1.8', color: '#444', marginBottom: '1rem' }}>
                            Founded with a passion for exquisite craftsmanship and modern design, FurniDecor started as a small workshop dedicated to creating pieces that stand the test of time. Over the years, we have grown into a curated destination for premium furniture, maintaining our core values of quality, durability, and aesthetic excellence.
                        </p>
                        <p style={{ lineHeight: '1.8', color: '#444' }}>
                            From the sourcing of sustainable materials to the final polish, every step in our process is handled with care. We serve customers who appreciate the finer details and seek to build a home that tells their unique story.
                        </p>
                    </div>
                    <div style={{ flex: '1 1 400px' }}>
                        <img
                            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                            alt="Modern living room"
                            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}


export default AboutUs
