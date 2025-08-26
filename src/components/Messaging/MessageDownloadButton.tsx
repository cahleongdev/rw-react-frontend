import React from 'react';
import { CloudArrowDownIcon } from '@heroicons/react/24/outline';
import {
  Document,
  Page,
  Text,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

import { Message } from '@/containers/Messaging/index.types';

import { MessageButton } from '@components/base/MessageButton';

interface DownloadItemProps {
  title: string;
  messages: Message[];
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  text: {
    margin: 12,
    fontSize: 12,
    textAlign: 'justify',
  },
});

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

// Helper function to strip HTML tags
const stripHtml = (html: string) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// PDF Document Component
const PDFDocument = ({ messages, title = 'Document' }: DownloadItemProps) => (
  <Document title={title + formatDate(Date.now())}>
    <Page size="A4" style={styles.page}>
      {messages.map((message, index) => (
        <Text key={index} style={styles.text}>
          {`Date: ${formatDate(Number(message.timestamp))}\n${message.sender.first_name} ${message.sender.last_name}: ${stripHtml(message.content)}\n`}
        </Text>
      ))}
    </Page>
  </Document>
);

const MessageDownloadButton: React.FC<DownloadItemProps> = ({
  title,
  messages,
}) => {
  return (
    <MessageButton
      variant="ghost"
      size="icon"
      className="cursor-pointer relative w-6 h-6 rounded-full"
      tooltip="Download messages"
    >
      <PDFDownloadLink
        document={<PDFDocument messages={messages} title={title} />}
        fileName={title}
      >
        <CloudArrowDownIcon className="size-5 text-slate-700" />
      </PDFDownloadLink>
    </MessageButton>
  );
};

export default MessageDownloadButton;
