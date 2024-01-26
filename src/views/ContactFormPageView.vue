<template>
  <section class="contact">
   <div
     class="container contact__container light-bg2"
   >
      <aside class="contact__aside primary">
         <div class="aside__image">
            <img src="@/assets/images/contact.svg">
         </div>
         <h2>Get in Touch</h2>
         <p>
          
        At ereputation, we understand the importance of maintaining a positive and accurate online presence. Whether you have questions about managing your digital footprint, need assistance with our app, or want to learn more about our services, we're here to help.
         </p>
         <ul class="contact__details">
            <li>
               <i class="uil uil-phone-times"></i>
               <h5>xxx xxx xxx</h5>
            </li>
            <li>
               <i class="uil uil-envelope"></i>
               <h5>xxxx@xxxx.xxx</h5>
            </li>
            <li>
               <i class="uil uil-location-point"></i>
               <h5>xxxxx, xxxxx</h5>
            </li>
         </ul>

         <ul class="contact__socials">
            <li>
               <a href="#"><i class="uil uil-facebook-f"></i></a>
            </li>
            <li>
              <a href="#"><i class="uil uil-instagram-alt"></i></a>
            </li>
            <li>
              <a href="#"><i class="uil uil-twitter-alt"></i></a>
             </li>
            <li>
              <a href="#"><i class="uil uil-linkedin-alt"></i></a>
            </li>
         </ul>
      </aside>

      <form class="contact__form">
         <div class="form__name">
            <input type="text" name="First Name" placeholder="First Name" required>
            <input type="text" name="Last Name" placeholder="Last Name" required>
         </div>
         <input type="email" name="Email Address" placeholder="Your Email Address" required>
         <textarea name="Message" placeholder="Message" rows="7" required :style="{'width':'100%'}"/>
         <button type="submit" class="btn btn-primary">Send Message</button>
      </form>
   </div>
  </section>
</template>

<script setup>

</script>
<style scoped>
  .contact{
    position: relative;
    top: 5rem;
    width: 75%;
    margin: auto;
  }
</style>
  