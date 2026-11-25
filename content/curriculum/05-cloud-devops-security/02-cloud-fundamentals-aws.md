---
title: Cloud fundamentals with AWS
level: 2
summary: The core services (compute, storage, databases, networking, identity) and the security and cost habits that apply on any cloud.
outcomes: Map an application onto core AWS services | Write least-privilege IAM policies | Keep data private by default and control cost
---

## Why this matters

Most companies run on a public cloud, and AWS is the largest. You don't need every service; you need the dozen that everything else is built from, plus the security and cost habits. The same concepts exist on Google Cloud and Azure under other names.

## The core services

| Need | AWS | What to know |
|---|---|---|
| Virtual machines | EC2 | Instance types, AMIs, security groups, autoscaling groups |
| Containers | ECS (Fargate), EKS | Fargate runs containers without managing servers |
| Functions | Lambda | Event-driven, short-lived; cold starts; time limits |
| Object storage | S3 | Buckets private by default; encryption; presigned URLs for uploads/downloads |
| Relational DB | RDS / Aurora | Managed Postgres/MySQL, backups, read replicas |
| Queues & events | SQS, SNS, EventBridge | Decoupling; DLQs |
| Networking | VPC, subnets, security groups, ALB | Private subnets for databases; load balancers in public subnets |
| Identity | IAM | Roles, policies, least privilege |
| Secrets | Secrets Manager, SSM Parameter Store | Never in code or images |
| Keys | KMS | Encryption keys, per-tenant keys |
| Observability | CloudWatch, CloudTrail | Metrics and logs; audit trail of API calls |
| AI | Bedrock (+ AgentCore) | Managed model access and agent runtime ([9.4](/09-agents/04-frameworks-and-runtimes)) |

## How to do it: least privilege

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::clips-prod-private/uploads/*"
  }]
}
```

Attach policies to **roles** that services assume (an EC2 instance role, an ECS task role), not to long-lived user access keys. Grant exactly the actions and resources the service needs.

## Habits that apply to every cloud

- **Private by default:** buckets private, databases in private subnets, encryption at rest (KMS) and in transit (TLS).
- **Infrastructure as code:** Terraform, CDK or CloudFormation, reviewed like application code.
- **Cost:** tag resources by project; set budgets and alerts; rightsize instances after measuring; delete idle resources. Cost optimisation claims (like "cut AWS spend 35%") need a baseline and a mechanism, as every metric does.
- **Regions:** pick one close to users and compatible with data-residency rules.

## Common mistakes

- `"Action": "*"` policies "for now".
- Public S3 buckets for user uploads.
- Long-lived access keys on laptops and in CI instead of roles and short-lived credentials (OIDC from CI).
- Forgotten resources running for months.

## Check yourself

<details markdown="1"><summary>How should an EC2 or ECS service get permission to read from S3?</summary>

Through an IAM role attached to the instance or task, with a policy limited to the specific bucket prefix and actions it needs. No access keys in environment variables.

</details>

<details markdown="1"><summary>What's a presigned URL and why use one?</summary>

A time-limited URL granting one specific S3 operation on one object. Clients upload or download directly to S3 without your servers proxying the bytes, and without being given credentials.

</details>

## Build it

In a free-tier account (or LocalStack): create a private bucket, an IAM role with access to one prefix only, and generate a presigned upload URL from your service.

## What comes next

[5.3 Deployment platforms](/05-cloud-devops-security/03-deployment-platforms).
