;; platform-token contract
(impl-trait .sip-010-trait.sip-010-trait)

(define-fungible-token xfit u1000000000000000)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (try! (ft-transfer? xfit amount sender recipient))
        (match memo to-print (print to-print) 0x)
        (ok true)
    )
)

(define-read-only (get-name)
    (ok "XFIT")
)

(define-read-only (get-symbol)
    (ok "XFIT")
)

(define-read-only (get-decimals)
    (ok u6)
)

(define-read-only (get-balance (who principal))
    (ok (ft-get-balance xfit who))
)

(define-read-only (get-total-supply)
    (ok (ft-get-supply xfit))
)

(define-read-only (get-token-uri)
    (ok none)
)

;; Initialize the contract
(begin
    (try! (ft-mint? xfit u1000000000000000 contract-owner))
)
