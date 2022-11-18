import React from 'react'
import NavigationButtons from './NavigationButtons';
import SentenceList from './SentenceList';

export default function MainDisplay() {
  return (
    <div>
      <SentenceList />
      <NavigationButtons />
    </div>
  )
}
