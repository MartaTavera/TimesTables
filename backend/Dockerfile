# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY TimetablesAPI.csproj .
RUN dotnet restore TimetablesAPI.csproj

# Copy everything else
COPY . .

# Publish
RUN dotnet publish TimetablesAPI.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy published files
COPY --from=build /app/publish .

# Expose port
EXPOSE 10000

# Set environment variables
ENV ASPNETCORE_URLS=http://+:10000
ENV ASPNETCORE_ENVIRONMENT=Production

# Run
ENTRYPOINT ["dotnet", "TimetablesAPI.dll"]