import { VStack, HStack, Text, Input, Button, Box } from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa";
import { INVITATION_COLORS } from "@/constants/invitation-theme";
import { toaster } from "@/components/ui/toaster-instance";

// ============================================================================
// Digital Angpao Component
// ============================================================================

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface DigitalAngpaoProps {
  bankAccount?: BankAccount;
}

// Default placeholder bank account
const DEFAULT_BANK_ACCOUNT: BankAccount = {
  bankName: "BCA",
  accountNumber: "1234567890",
  accountName: "Bride & Groom",
};

export default function DigitalAngpao({
  bankAccount = DEFAULT_BANK_ACCOUNT,
}: DigitalAngpaoProps) {
  const account = bankAccount || DEFAULT_BANK_ACCOUNT;

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(account.accountNumber);
    toaster.create({
      title: "Account number copied!",
      description: "Pasted to clipboard",
      type: "success",
      duration: 3000,
    });
  };

  return (
    <VStack gap={6} w="full">
      <Box
        bg={INVITATION_COLORS.backgroundWhite}
        borderRadius="3xl"
        p={{ base: 6, md: 8 }}
        w="full"
        borderWidth="1px"
        borderColor={INVITATION_COLORS.primaryMuted}
      >
        <VStack gap={4} align="stretch">
          {/* Bank name */}
          <VStack gap={1} align="start">
            <Text
              fontSize="xs"
              color={INVITATION_COLORS.textMuted}
              fontWeight="medium"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Bank Name
            </Text>
            <Text
              fontSize="xl"
              color={INVITATION_COLORS.text}
              fontWeight="bold"
            >
              {account.bankName}
            </Text>
          </VStack>

          {/* Account number */}
          <VStack gap={1} align="start">
            <Text
              fontSize="xs"
              color={INVITATION_COLORS.textMuted}
              fontWeight="medium"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Account Number
            </Text>
            <HStack w="full" gap={2}>
              <Input
                value={account.accountNumber}
                readOnly
                size="lg"
                bg={INVITATION_COLORS.primaryLight}
                borderColor={INVITATION_COLORS.primaryMuted}
                color={INVITATION_COLORS.text}
                fontWeight="bold"
                fontSize="xl"
                letterSpacing="wide"
                _focus={{ borderColor: INVITATION_COLORS.primary }}
              />
              <Button
                aria-label="Copy account number"
                onClick={copyAccountNumber}
                size="lg"
                colorPalette="blue"
                variant="solid"
                flexShrink={0}
              >
                <FaCopy />
              </Button>
            </HStack>
          </VStack>

          {/* Account name */}
          <VStack gap={1} align="start">
            <Text
              fontSize="xs"
              color={INVITATION_COLORS.textMuted}
              fontWeight="medium"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Account Name
            </Text>
            <Text
              fontSize="lg"
              color={INVITATION_COLORS.text}
              fontWeight="semibold"
            >
              {account.accountName}
            </Text>
          </VStack>
        </VStack>
      </Box>

      <Text
        fontSize="sm"
        color={INVITATION_COLORS.textMuted}
        textAlign="center"
        fontStyle="italic"
      >
        Your blessing means the world to us 💝
      </Text>
    </VStack>
  );
}
