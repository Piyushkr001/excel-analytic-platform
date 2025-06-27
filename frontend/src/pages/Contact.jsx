  <section id="contact" style="padding: 40px; background-color: #f9f9f9;">
  <div style="max-width: 800px; margin: auto;">
    <h2 style="text-align: center;">Contact Us</h2>
    
    <form action="/contact" method="POST" style="display: flex; flex-direction: column; gap: 15px; margin-top: 30px;">
      <input type="text" name="name" placeholder="Your Name" required style="padding: 10px;">
      <input type="email" name="email" placeholder="Your Email" required style="padding: 10px;">
      <textarea name="message" placeholder="Your Message" rows="5" required style="padding: 10px;"></textarea>
      <button type="submit" style="padding: 10px; background-color: #4CAF50; color: white; border: none;">Send Message</button>
     </form>

    <div style="margin-top: 40px;">
      <h3>Contact Details</h3>
      <p><strong>Email:</strong> support@xcellytics.com</p>
      <p><strong>Phone:</strong> +91-9876543210</p>
      <p><strong>Address:</strong> 123, Analytics Street, Pune, India</p>
    </div>

    <!-- Optional: Google Maps Embed -->
    <div style="margin-top: 30px;">
      <iframe src="https://maps.google.com/maps?q=pune&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    </div>
  </div>
</section>
