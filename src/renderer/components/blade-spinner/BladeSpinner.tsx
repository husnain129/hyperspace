/* eslint-disable react/destructuring-assignment */
import Styles from './BladeSpinner.module.css';

// eslint-disable-next-line react/require-default-props
export default function BladeSpinner(props: { size?: 'sm' | 'md' }) {
  return (
    <div className={`${Styles.spinner} ${Styles[props.size || 'md']}`}>
      {[...new Array(12)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className={Styles['spinner-blade']} />
      ))}
    </div>
  );
}
