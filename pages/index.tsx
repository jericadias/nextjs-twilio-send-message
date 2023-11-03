import { BaseSyntheticEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import Image from 'next/image';

const Home = () => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('CA'); // Default to Canada
  const [stateProvince, setStateProvince] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [zipCodeError, setZipCodeError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const phonePattern = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    setPhoneError(!phonePattern.test(phone) && phone !== '');
  }, [phone]);

  useEffect(() => {
    let zipCodePattern;
    if (country === 'US') {
      zipCodePattern = /^\d{5}(-\d{4})?$/;
    } else if (country === 'CA') {
      zipCodePattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    }
    setZipCodeError(zipCodePattern ? !zipCodePattern.test(zipCode) && zipCode !== '' : false);
  }, [zipCode, country]);

  const sendMessage = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (phoneError || zipCodeError) return;

    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      const res = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          location,
          address,
          city,
          country,
          stateProvince,
          zipCode,
        }),
      });

      const apiResponse = await res.json();

      if (apiResponse.success) {
        setSuccess(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError(true);
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Next.js + Twilio</title>
      </Head>
      <form className={styles.form} onSubmit={sendMessage}>
        <div>
    </div>
    <div>
      <Image
        src="/emberalert.png"
        width={900}
        height={200}
        alt="Picture of the author"
      />
    </div>
    <h1 className={styles.title}>
          Opt in to receive SMS text messages if a wildfire is in your area!
        </h1>

        <div className={styles.formGroup}>
          <label htmlFor='phone'>Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            onChange={(e) => setPhone(e.target.value)}
            placeholder='Phone Number'
            className={styles.input}
            required
            autoComplete="tel"
          />
          {phoneError && (
            <span className={styles.error}>
              Please enter a valid US or Canada phone number
            </span>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="inputAddress">Address</label>
            <input
              type="text"
              className={styles.input}
              id="inputAddress"
              placeholder="1234 Main St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="inputCity">City</label>
            <input
              type="text"
              className={styles.input}
              id="inputCity"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="address-level2"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="country">Country</label>
            <select
              id="country"
              className={styles.select}
              onChange={(e) => setCountry(e.target.value)}
              value={country}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="stateProvince">State/Province</label>
            <input
              type="text"
              className={styles.input}
              id="stateProvince"
              value={stateProvince}
              onChange={(e) => setStateProvince(e.target.value)}
              autoComplete="address-level1"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="zipCode">Zip/Postal Code</label>
            <input
              type="text"
              className={styles.input}
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              autoComplete="postal-code"
            />
            {zipCodeError && (
              <span className={styles.error}>
                Please enter a valid zip/postal code
              </span>
            )}
          </div>
        </div>

        <button disabled={loading} type="submit" className={styles.button}>
          Submit
        </button>
        {success && <p className={styles.success}>Message sent successfully.</p>}
        {error && (
          <p className={styles.error}>
            Something went wrong. Please check the number.
          </p>
        )}
      </form>
    </div>
  );
};

export default Home;
