import { Dispatch, SetStateAction } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { Dialog, DialogContent, DialogTitle } from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { Checkbox } from '@/components/base/Checkbox';

interface PrivacyPolicyProps {
  accept?: boolean;
  showPrivacy: boolean;
  showAccept?: boolean;
  setShowPrivacy: Dispatch<SetStateAction<boolean>>;
  setAccept?: Dispatch<SetStateAction<boolean>>;
  onNext?: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  showPrivacy,
  showAccept,
  setShowPrivacy,
  accept,
  setAccept,
  onNext,
}: PrivacyPolicyProps) => {
  const handleClose = () => {
    setShowPrivacy(false);
    setAccept?.(false);
  };

  return (
    <Dialog open={showPrivacy} onOpenChange={handleClose}>
      <DialogContent
        className="min-w-[680px] bg-white rounded-lg p-0 gap-0"
        showClose={false}
      >
        <DialogTitle className="hidden" />
        <div className="h-15 flex flex-row justify-between items-center px-4">
          <h3 className="leading-[1.4] text-slate-700">Privacy Policy</h3>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={handleClose} />
        </div>
        <div className="p-6 border-t border-slate-200">
          <div className="bg-teal-50 border border-slate-300 p-4 text-slate-500 body3-regular flex flex-col gap-4 max-h-[434px] overflow-auto">
            <div className="font-medium italic">Last updated July 13, 2023</div>
            <div>
              This privacy notice for Reportwell, Inc. ("we," "us," or "our"),
              describes how and why we might collect, store, use, and/or share
              ("process") your information when you use our services
              ("Services"), such as when you:
            </div>
            {/* <ul> */}
            <div className="flex flex-col">
              <div className="flex flex-row">
                <li className="ml-2" />
                <div>
                  Visit our website at https://www.reportwell.io/, or any
                  website of ours that links to this privacy notice
                </div>
              </div>
              <div className="flex flex-row">
                <li className="ml-2" />
                <div>
                  Download and use our web application (Reportwell), or any
                  other application of ours that links to this privacy notice
                </div>
              </div>
              <div className="flex flex-row">
                <li className="ml-2" />
                <div>
                  Engage with us in other related ways, including any sales,
                  marketing, or events
                </div>
              </div>
            </div>
            <div>
              Questions or concerns? Reading this privacy notice will help you
              understand your privacy rights and choices. If you do not agree
              with our policies and practices, please do not use our Services.
              If you still have any questions or concerns, please contact us at
              admin@reportwell.io.
            </div>
            <div className="font-medium">SUMMARY OF KEY POINTS</div>
            <div>
              This summary provides key points from our privacy notice, but you
              can find out more details about any of these topics by clicking
              the link following each key point or by using our table of
              contents below to find the section you are looking for.
            </div>
            <div className="flex flex-col">
              <div className="font-medium">
                What personal information do we process?
              </div>
              <div>
                When you visit, use, or navigate our Services, we may process
                personal information depending on how you interact with us and
                the Services, the choices you make, and the products and
                features you use. Learn more about personal information you
                disclose to us.
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-medium">
                Do we process any sensitive personal information?
              </div>
              <div>
                We may process sensitive personal information when necessary
                with your consent or as otherwise permitted by applicable law.
                Learn more about sensitive information we process.
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-medium">
                Do we receive any information from third parties?
              </div>
              <div>We do not receive any information from third parties.</div>
            </div>
            <div className="flex flex-col">
              <div className="font-medium">
                How do we process your information?
              </div>
              <div>
                We process your information to provide,improve, and administer
                our Services, communicate with you, for security and fraud
                prevention, and to comply with law. We may also process your
                information for other purposes with your consent. We process
                your information only when we have a valid legal reason to do
                so. Learn more about how we process your information.
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-medium">
                In what situations and with which parties do we share personal
                information?
              </div>
              <div>
                We may share information in specific situations and with
                specific third parties. Learn more about when and with whom we
                share your personal information.
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-medium">
                How do we keep your information safe?
              </div>
              <div>
                We have organizational and technical processes and procedures in
                place to protect your personal information. However, no
                electronic transmission over the internet or information storage
                technology can be guaranteed to be 100% secure, so we cannot
                promise or guarantee that hackers,cybercriminals, or other
                unauthorized third parties will not be able to defeat our
                security and improperly collect, access, steal, or modify your
                information. Learn more about how we keep your information safe.
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-medium">What are your rights?</div>
              <div>
                Depending on where you are located geographically, the
                applicable privacy law may mean you have certain rights
                regarding your personal information. Learn more about your
                privacy rights.
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-medium">
                How do you exercise your rights?
              </div>
              <div>
                The easiest way to exercise your rights is by submitting a data
                subject access request, or by contacting us. We will consider
                and act upon any request in accordance with applicable data
                protection laws.
              </div>
            </div>
            <div>
              Want to learn more about what we do with any information we
              collect? Review the privacy notice in full.
            </div>
          </div>
        </div>
        {showAccept && (
          <div className="flex justify-end items-center px-4 h-16.5 gap-4 border-t border-beige-300 bg-beige-50">
            <div className="flex flex-row gap-2 items-center cursor-pointer">
              <Checkbox
                id="accept"
                name="accept"
                checked={accept}
                className="border-slate-700 bg-white data-[state=checked]:border-none"
                onCheckedChange={() => setAccept?.(!accept)}
              />
              <label htmlFor="accept" className="body2-regular text-slate-700">
                I've read and accept the Privacy Policy
              </label>
            </div>
            <Button
              className="text-white bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed"
              disabled={!accept}
              onClick={() => onNext?.()}
            >
              Create Account
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;
