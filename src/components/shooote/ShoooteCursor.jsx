import { useEffect } from 'react';

export default function ShoooteCursor() {
  useEffect(() => {
    const cursor = document.querySelector('.cursor');
    const cursorInner = document.querySelector('.cursor2');
    if (!cursor || !cursorInner) return undefined;

    const onMove = (e) => {
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
      cursorInner.style.left = `${e.clientX}px`;
      cursorInner.style.top = `${e.clientY}px`;
    };

    const onDown = () => {
      cursor.classList.add('click');
      cursorInner.classList.add('cursorinnerhover');
    };

    const onUp = () => {
      cursor.classList.remove('click');
      cursorInner.classList.remove('cursorinnerhover');
    };

    const onLinkOver = (e) => {
      if (e.target.closest('a')) cursor.classList.add('hover');
    };

    const onLinkOut = (e) => {
      if (e.target.closest('a')) cursor.classList.remove('hover');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onLinkOver);
    document.addEventListener('mouseout', onLinkOut);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onLinkOver);
      document.removeEventListener('mouseout', onLinkOut);
    };
  }, []);

  return (
    <>
      <div className="cursor" />
      <div className="cursor2" />
    </>
  );
}
